import { Outlet } from 'react-router-dom'
import Header from '@/components/header'

const AppLayout = () => {
    return (
        <div>
            <div className='grid-background'></div>
            {/* <main className="min-h-screen container"> */}
            <main className="mx-auto min-h-screen max-w-10xl px-8 sm:px-10 lg:px-12">
                <Header />
                <Outlet />
            </main>
            <div className='p-10 text-center bg-gray-800 mt-10'>A personal project of mine.❤️</div>
        </div>
    )
}

export default AppLayout
