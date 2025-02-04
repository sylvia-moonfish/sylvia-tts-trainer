"use client";

import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">실무새 트레이너</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link color={pathname === "/" ? "primary" : "foreground"} href="/">
            훈련하기
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/instruction"}>
          <Link
            color={pathname === "/instruction" ? "primary" : "foreground"}
            href="/instruction"
          >
            설명서 보기
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-6">
          {user && (
            <Button
              color="danger"
              radius="sm"
              size="md"
              variant="shadow"
              onPress={async () => {
                await fetch("/api/auth/logout");
                location.reload();
              }}
            >
              로그아웃
            </Button>
          )}
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
