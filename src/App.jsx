import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import Landing from "./pages/Landing"
import Onboarding from "./pages/Onboarding"
import SavedJobs from "./pages/SavedJobs"
import PostJobs from "./pages/PostJobs"
import MyJobs from "./pages/MyJobs"
import JobPage from "./pages/JobPage"
import JobListings from "./pages/JobListings"
import "./App.css"
import { ThemeProvider } from "./components/Theme-provider"
import ProtectedRoute from "./components/Protected-route"

function App() {
    const router = createBrowserRouter([
        {
            element: <AppLayout />,
            children: [
                {
                    path: "/",
                    element: <Landing />
                },
                {
                    path: "/onboarding",
                    element:
                        <ProtectedRoute>
                            <Onboarding />
                        </ProtectedRoute>
                },
                {
                    path: "/saved-jobs",
                    element:
                        <ProtectedRoute>
                            <SavedJobs />
                        </ProtectedRoute>
                },
                {
                    path: "/post-jobs",
                    element:
                        <ProtectedRoute>
                            <PostJobs />
                        </ProtectedRoute>
                },
                {
                    path: "/my-jobs",
                    element:
                        <ProtectedRoute>
                            <MyJobs />
                        </ProtectedRoute>   
                },
                {
                    path: "/job/:id",
                    element:
                        <ProtectedRoute>
                            <JobPage />
                        </ProtectedRoute>
                },
                {
                    path: "/jobs",
                    element:
                        <ProtectedRoute>
                            <JobListings />
                        </ProtectedRoute>
                }

            ]
        }
    ])
    return (
            <RouterProvider router={router} />
    )
}

export default App