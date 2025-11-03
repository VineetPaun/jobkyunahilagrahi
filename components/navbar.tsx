'use client'
import Link from 'next/link'
import { Equal, X, LogOut, User } from 'lucide-react'
import { LiquidButton } from '@/components/liquid-glass-button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/ui/apple-liquid-glass-switcher'
import { authClient } from '@/lib/auth-client'
import { usePathname, useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' }
]

export const Header = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [session, setSession] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)
    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    React.useEffect(() => {
        const fetchSession = async () => {
            const { data } = await authClient.getSession()
            setSession(data)
            setLoading(false)
        }
        fetchSession()
    }, [])

    const handleSignOut = async () => {
        await authClient.signOut()
        setSession(null)
        router.push('/')
    }
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed left-0 w-full z-20 px-2">
                <div className={cn('mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-8', isScrolled && 'bg-background/80 max-w-6xl rounded-2xl border backdrop-blur-lg')}>
                    <div className="relative flex items-center justify-between py-3">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex gap-2 items-center">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 392.02 324.6"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="#fff200"
                                        d="M268.08,0c-27.4,0-51.41,4.43-72.07,13.26C175.36,4.43,151.35,0,123.95,0H0v324.6h123.95c27.37,0,51.38-4.58,72.07-13.7,20.69,9.12,44.7,13.7,72.07,13.7h123.95V0h-123.95ZM324.09,268.36h-47.91c-20.25,0-37.3-4.05-51.18-12.15-12.28-7.17-21.94-17.41-28.99-30.7h0s0,0,0,0c0,0,0,0,0,0h0c-7.05,13.29-16.71,23.53-28.99,30.7-13.87,8.1-30.93,12.15-51.18,12.15h-47.91V56.24h47.91c19.8,0,36.67,4.01,50.61,12.04,12.51,7.2,22.35,17.47,29.55,30.77h0s0,0,0,0c0,0,0,0,0,0h0c7.2-13.3,17.04-23.57,29.55-30.77,13.95-8.02,30.82-12.04,50.61-12.04h47.91v212.13Z"></path>
                                </svg>
                                <p className='text-2xl tracking-wide font-medium'>
                                    JobKyuNahiLagRahi
                                </p>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuState(!menuState)}
                            aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                            className="lg:hidden relative z-20 cursor-pointer p-2">
                            <Equal className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                            <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                        </button>

                        {/* Desktop Menu - Center */}
                        <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                            <ul className="glass-menu">
                                {menuItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

                                    return (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className={cn('glass-menu__item text-sm', isActive && 'glass-menu__item--active')}
                                                aria-current={isActive ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Right Side - Theme Switcher & Auth Buttons */}
                        <div className="hidden lg:flex items-center gap-3">
                            <ThemeSwitcher />
                            {!loading && (
                                session ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <LiquidButton
                                                variant="default"
                                                size="sm"
                                                className="gap-2">
                                                <User className="size-4" />
                                                <span className="hidden sm:inline">
                                                    {session.user.name || session.user.email}
                                                </span>
                                            </LiquidButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard" className="cursor-pointer">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={handleSignOut}
                                                className="cursor-pointer text-destructive focus:text-destructive">
                                                <LogOut className="mr-2 size-4" />
                                                Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <>
                                        <LiquidButton
                                            asChild
                                            variant="default"
                                            size="sm">
                                            <Link href="/sign-in">
                                                <span>Sign In</span>
                                            </Link>
                                        </LiquidButton>
                                        <LiquidButton
                                            asChild
                                            size="sm">
                                            <Link href="/sign-up">
                                                <span>Sign Up</span>
                                            </Link>
                                        </LiquidButton>
                                    </>
                                )
                            )}
                        </div>

                        {/* Mobile Menu */}
                        <div className="bg-background in-data-[state=active]:block absolute top-full left-0 right-0 mt-2 hidden w-full rounded-2xl border p-6 shadow-2xl backdrop-blur-lg lg:hidden">
                            <div>
                                <ul className={cn('glass-menu glass-menu--stacked mb-6 text-base')}>
                                    {menuItems.map((item, index) => {
                                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

                                        return (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className={cn('glass-menu__item glass-menu__item--stacked', isActive && 'glass-menu__item--active')}
                                                    aria-current={isActive ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <ThemeSwitcher />
                                {!loading && (
                                    session ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <LiquidButton
                                                    variant="default"
                                                    size="sm"
                                                    className="gap-2 w-full">
                                                    <User className="size-4" />
                                                    <span>
                                                        {session.user.name || session.user.email}
                                                    </span>
                                                </LiquidButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href="/dashboard" className="cursor-pointer">
                                                        Dashboard
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={handleSignOut}
                                                    className="cursor-pointer text-destructive focus:text-destructive">
                                                    <LogOut className="mr-2 size-4" />
                                                    Sign Out
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <>
                                            <LiquidButton
                                                asChild
                                                variant="default"
                                                size="sm"
                                                className="w-full">
                                                <Link href="/sign-in">
                                                    <span>Sign In</span>
                                                </Link>
                                            </LiquidButton>
                                            <LiquidButton
                                                asChild
                                                size="sm"
                                                className="w-full">
                                                <Link href="/sign-up">
                                                    <span>Sign Up</span>
                                                </Link>
                                            </LiquidButton>
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}