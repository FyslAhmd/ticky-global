#!/usr/bin/env python3
"""
Ticky Global - Client AI Sync & Verification Tool
=================================================
Automates comparing, auditing, and safely merging client code exports
(from browser-based AI tools like Kimi AI) into the official Git repository
without breaking production infrastructure, database schemas, authentication,
or server configurations.

Usage:
  python3 scripts/sync-client.py --audit <path-to-client-folder>
  python3 scripts/sync-client.py --diff <path-to-file> <path-to-client-folder>
  python3 scripts/sync-client.py --apply-data <path-to-client-folder>
  python3 scripts/sync-client.py --help
"""

import sys
import os
import argparse
import subprocess
import filecmp
from pathlib import Path

# Paths that must NEVER be blindly overwritten from an AI client export
PROTECTED_INFRASTRUCTURE = {
    ".env",
    ".env.example",
    "package-lock.json",
    "api/boot.ts",
    "api/context.ts",
    "api/middleware.ts",
    "api/lib/env.ts",
    "api/auth-router.ts",
    "api/router.ts",
    "api/kimi/auth.ts",
    "api/queries/users.ts",
    "contracts/constants.ts",
    "db/schema.ts",
    "db/seed.ts",
    "deploy.md",
    "REDEPLOY_GUIDE.md",
    "PROJECT_OVERVIEW.md",
    "TRACKING-SETUP.md",
    "guideline.md",
}

# Features that exist in Git and must never be deleted just because the client doesn't have them
GIT_ONLY_FEATURES = {
    "api/auth",
    "api/portal-router.ts",
    "api/queries/portal.ts",
    "src/lib/tracking.ts",
    "src/components/CtaBand.tsx",
    "src/pages/Blog.tsx",
    "src/pages/BlogPost.tsx",
    "src/pages/Register.tsx",
    "src/pages/admin/Blog.tsx",
    "src/pages/admin/BlogEditor.tsx",
    "src/pages/admin/ClientDetail.tsx",
    "src/pages/admin/Clients.tsx",
    "src/pages/admin/Crm.tsx",
    "src/pages/admin/Socials.tsx",
    "src/pages/admin/Users.tsx",
}

# Files with sensitive server/tracking hooks that require surgical review
HYBRID_FILES = {
    "index.html": "Contains Google Tag Manager (GTM) noscript tag",
    "src/lib/analytics.ts": "Contains GA4 / GTM page_view tracking integration",
    "src/index.css": "Contains mobile horizontal pull/overscroll fixes",
    "src/App.tsx": "Contains routes for CRM, Blog, Clients, Socials, Register",
    "src/components/AdminLayout.tsx": "Contains navigation for CRM, Clients, Socials, Blog",
    "src/components/Navbar.tsx": "Contains Blog link and responsive mobile navigation",
    "src/components/Footer.tsx": "Contains dynamic database social links and Blog link",
    "src/components/Layout.tsx": "Contains CtaBand auto-injection and page tracking",
    "src/pages/Login.tsx": "Contains Local Auth (password/bcrypt) form vs Kimi OAuth",
    "src/pages/ClientPortal.tsx": "Contains live Client Portal vs dummy placeholder",
    "src/pages/Contact.tsx": "Contains GTM enquiry_submitted conversion tracking",
    "src/sections/CtaSection.tsx": "Contains GTM cta_click conversion tracking",
    "src/sections/SavingsCalculator.tsx": "Contains GTM calculator_used conversion tracking",
}

# Safe content data paths where client pricing, copy, and testimonials live
SAFE_CONTENT_PREFIXES = (
    "src/data/",
    "public/images/",
    "public/favicon",
)

def get_git_root():
    script_dir = Path(__file__).resolve().parent
    return script_dir.parent

def scan_directories(git_root: Path, client_root: Path):
    differences = []
    only_in_git = []
    only_in_client = []

    ignore_patterns = {".git", "node_modules", ".DS_Store", "dist", ".vite"}

    def walk_compare(rel_path=""):
        p_git = git_root / rel_path
        p_client = client_root / rel_path

        if not p_client.exists():
            only_in_git.append(rel_path)
            return
        if not p_git.exists():
            only_in_client.append(rel_path)
            return

        if p_git.is_file() and p_client.is_file():
            if not filecmp.cmp(p_git, p_client, shallow=False):
                differences.append(rel_path)
            return

        if p_git.is_dir() and p_client.is_dir():
            git_entries = {e for e in os.listdir(p_git) if e not in ignore_patterns}
            client_entries = {e for e in os.listdir(p_client) if e not in ignore_patterns}

            for f in git_entries - client_entries:
                r = os.path.join(rel_path, f) if rel_path else f
                only_in_git.append(r)
            for f in client_entries - git_entries:
                r = os.path.join(rel_path, f) if rel_path else f
                only_in_client.append(r)
            for f in git_entries & client_entries:
                r = os.path.join(rel_path, f) if rel_path else f
                walk_compare(r)

    walk_compare()
    return sorted(differences), sorted(only_in_git), sorted(only_in_client)

def audit_report(git_root: Path, client_root: Path):
    print("=" * 70)
    print(" 🔍 TICKY GLOBAL - CLIENT CODE SYNC & SAFETY AUDIT")
    print("=" * 70)
    print(f" Official Git Repo : {git_root}")
    print(f" Incoming Client Dir: {client_root}\n")

    diffs, git_only, client_only = scan_directories(git_root, client_root)

    # 1. Critical Infrastructure Regressions
    infra_diffs = [f for f in diffs if f in PROTECTED_INFRASTRUCTURE or any(f.startswith(p) for p in PROTECTED_INFRASTRUCTURE)]
    print(f"🛑 1. PROTECTED INFRASTRUCTURE FILES ({len(infra_diffs)} detected)")
    print("   [DO NOT OVERWRITE - These protect your server from crashing]")
    for f in infra_diffs:
        reason = ""
        if "boot.ts" in f:
            reason = " (Protects Passenger Node 22 async IIFE boot)"
        elif "package-lock.json" in f:
            reason = " (Protects against broken npm.mirrors.msh.team)"
        elif ".env" in f:
            reason = " (Protects your MariaDB credentials vs Kimi Aliyun DB)"
        elif "auth" in f:
            reason = " (Protects Local Bcrypt Auth vs Kimi OAuth)"
        elif "schema.ts" in f or "seed.ts" in f:
            reason = " (Protects CRM, Clients, Socials, Blog DB tables)"
        print(f"   • {f}{reason}")
    print()

    # 2. Production Features Preserved in Git
    print(f"🚀 2. PRODUCTION FEATURES PRESERVED IN GIT ({len(git_only)} items)")
    print("   [SAFE - Client AI export lacks these, Git keeps them intact]")
    for f in git_only:
        print(f"   • {f}")
    print()

    # 3. Hybrid Files
    hybrid_diffs = [f for f in diffs if f in HYBRID_FILES]
    print(f"⚠️  3. HYBRID FILES ({len(hybrid_diffs)} files)")
    print("   [Requires selective merging: Client made changes, but Git has tracking/auth]")
    for f in hybrid_diffs:
        print(f"   • {f} -> {HYBRID_FILES.get(f, '')}")
    print()

    # 4. Safe Content & Data Updates
    safe_diffs = [f for f in diffs if any(f.startswith(p) for p in SAFE_CONTENT_PREFIXES)]
    print(f"✅ 4. SAFE CLIENT CONTENT & DATA UPDATES ({len(safe_diffs)} files)")
    print("   [SAFE TO SYNC - Pricing, copy, testimonials, and assets]")
    for f in safe_diffs:
        print(f"   • {f}")
    print()

    if client_only:
        print(f"📦 5. NEW FILES IN CLIENT EXPORT ({len(client_only)} items)")
        for f in client_only:
            print(f"   • {f}")
        print()

    print("=" * 70)
    print(" 💡 RECOMMENDATION:")
    if safe_diffs:
        print(f" To safely apply the {len(safe_diffs)} content/pricing files, run:")
        print(f"   python3 scripts/sync-client.py --apply-data {client_root}")
    else:
        print(" No new safe content updates found.")
    print("=" * 70)

def show_file_diff(git_root: Path, client_root: Path, file_path: str):
    p_git = git_root / file_path
    p_client = client_root / file_path

    if not p_git.exists() or not p_client.exists():
        print(f"Error: One of the files does not exist ({p_git} vs {p_client})")
        return

    subprocess.run(["git", "diff", "--no-index", "--color=always", str(p_git), str(p_client)])

def apply_safe_data(git_root: Path, client_root: Path):
    diffs, _, _ = scan_directories(git_root, client_root)
    safe_diffs = [f for f in diffs if any(f.startswith(p) for p in SAFE_CONTENT_PREFIXES)]

    if not safe_diffs:
        print("No safe content/data files to apply.")
        return

    print("Copying safe content files to Git repository...")
    for f in safe_diffs:
        src = client_root / f
        dst = git_root / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        with open(src, "rb") as s, open(dst, "wb") as d:
            d.write(s.read())
        print(f"  ✓ Updated {f}")

    print("\nFiles updated successfully!")
    print("Check git status with: git status")
    print("Review diff with: git diff src/data")

def main():
    parser = argparse.ArgumentParser(description="Ticky Global Client AI Sync Tool")
    parser.add_argument("--audit", type=str, help="Path to client export folder to audit")
    parser.add_argument("--diff", type=str, help="File relative path to diff against client folder")
    parser.add_argument("--apply-data", type=str, help="Path to client export folder to copy safe content from")

    args = parser.parse_args()
    git_root = get_git_root()

    if args.audit:
        client_root = Path(args.audit).resolve()
        if not client_root.exists():
            print(f"Error: Path {client_root} does not exist.")
            sys.exit(1)
        audit_report(git_root, client_root)
    elif args.apply_data:
        client_root = Path(args.apply_data).resolve()
        if not client_root.exists():
            print(f"Error: Path {client_root} does not exist.")
            sys.exit(1)
        apply_safe_data(git_root, client_root)
    elif args.diff and len(sys.argv) >= 4:
        file_path = args.diff
        client_root = Path(sys.argv[3]).resolve()
        show_file_diff(git_root, client_root, file_path)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
