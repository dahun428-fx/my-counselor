"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            My Counselor
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/chat"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            AI 상담
          </Link>
          <Link
            href="/diagnosis"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            자가 진단
          </Link>
          <Link
            href="/community"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            커뮤니티
          </Link>
          <Link
            href="/meditation"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            명상
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            로그인
          </Link>
          <Link
            href="/chat"
            className="inline-flex h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            상담 시작하기
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            <Link
              href="/chat"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI 상담
            </Link>
            <Link
              href="/diagnosis"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              자가 진단
            </Link>
            <Link
              href="/community"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              커뮤니티
            </Link>
            <Link
              href="/meditation"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              명상
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
              <Link
                href="/login"
                className="inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                href="/chat"
                className="inline-flex h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                상담 시작하기
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
