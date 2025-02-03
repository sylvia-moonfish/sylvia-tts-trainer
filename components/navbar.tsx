"use client";

import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user } = useAuth();

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
