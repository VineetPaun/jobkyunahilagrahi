'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Equal, X, LogOut, User, Github, Linkedin } from 'lucide-react'
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
    { name: 'Home', href: '/' },
    { name: 'Review', href: '/review' }
]

export const Header = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [session, setSession] = React.useState<{ user: { name?: string; email?: string; image?: string | null } } | null>(null)
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
                                <Image
                                    src="/website_logo.png"
                                    alt="JobKyuNahiLagRahi logo"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    priority
                                />
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
                            <a
                                href="https://github.com/VineetPaun"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                                aria-label="GitHub Profile"
                            >
                                <Github className="size-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/vineetpaun/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-accent rounded-lg transition-colors"
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin className="size-5" />
                            </a>
                            <ThemeSwitcher />
                            {!loading && (
                                session ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <LiquidButton
                                                variant="default"
                                                size="lg"
                                                className="gap-2 h-12 px-6">
                                                <User className="size-5" />
                                                <span className="hidden sm:inline">
                                                    {session.user.name || session.user.email}
                                                </span>
                                            </LiquidButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                            size="lg"
                                            className="h-11 px-6 font-semibold"
                                        >
                                            <Link href="/sign-in">Login</Link>
                                        </LiquidButton>
                                        <LiquidButton
                                            asChild
                                            size="lg"
                                            className="h-11 px-6 font-semibold"
                                        >
                                            <Link href="/sign-up">Register</Link>
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
                                <div className="flex items-center gap-3">
                                    <a
                                        href="https://github.com/VineetPaun"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-accent rounded-lg transition-colors flex-1 flex justify-center"
                                        aria-label="GitHub Profile"
                                    >
                                        <Github className="size-5" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/vineetpaun/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-accent rounded-lg transition-colors flex-1 flex justify-center"
                                        aria-label="LinkedIn Profile"
                                    >
                                        <Linkedin className="size-5" />
                                    </a>
                                    <ThemeSwitcher />
                                </div>
                                {!loading && (
                                    session ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <LiquidButton
                                                    variant="default"
                                                    size="lg"
                                                    className="gap-2 w-full h-12 px-6">
                                                    <User className="size-5" />
                                                    <span>
                                                        {session.user.name || session.user.email}
                                                    </span>
                                                </LiquidButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                                size="lg"
                                                className="w-full h-11 justify-center font-semibold"
                                            >
                                                <Link href="/sign-in">Login</Link>
                                            </LiquidButton>
                                            <LiquidButton
                                                asChild
                                                size="lg"
                                                className="w-full h-11 justify-center font-semibold"
                                            >
                                                <Link href="/sign-up">Register</Link>
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