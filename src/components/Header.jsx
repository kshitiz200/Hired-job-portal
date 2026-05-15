import { Link, useSearchParams } from "react-router-dom"
import { Button } from "./ui/button"
import { Show, SignIn, UserButton, useUser } from "@clerk/react"
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);
    const {user} = useUser();
    const [search, setSearch] = useSearchParams("");

    useEffect(() => {
        if (search.get("sign-in")) {
            setShowSignIn(true);
        }
    }, [search]);
    useEffect(() => {
        if (showSignIn) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showSignIn]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        }
    };
    return (
        <>
            <nav className="py-4 flex justify-between items-center">
                <Link to="/">
                    <img className="h-40" src="/Logo.png" alt="Logo" />
                </Link>
                <div className="flex gap-20 items-center">
                    <Show when="signed-out">
                        <Button variant="outline" size="xl" onClick={() => setShowSignIn(true)}>
                            Login
                        </Button>
                    </Show>

                    <Show when="signed-in">
                        {user?.unsafeMetadata?.role === 'recruiter' && (
                            <Link to="/post-jobs">
                                <Button variant="red" size="xl" className="rounded-full px-4 py-2">
                                    <PenBox size={20} className="mr-2" />
                                    Post a Job
                                </Button>
                            </Link>
                        )}
                        <UserButton appearance={{
                            elements: {
                                userButtonAvatarBox: "!w-20 !h-20 rounded-full",
                            },
                        }} >
                            <UserButton.MenuItems>
                                <UserButton.Link label="My Jobs" labelIcon={<BriefcaseBusiness size={18} />} href="/my-jobs" />
                                <UserButton.Link label="Saved Jobs" labelIcon={<Heart size={18} />} href="/saved-jobs" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </Show>
                </div>
            </nav>

            {showSignIn && createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-xl"
                    style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={handleOverlayClick}
                >
                    <div className="scale-150" onClick={(e) => e.stopPropagation()}>
                        <SignIn
                            routing="hash"
                            signUpForceRedirectUrl="/onboarding"
                            fallbackRedirectUrl="/onboarding"
                        />
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default Header