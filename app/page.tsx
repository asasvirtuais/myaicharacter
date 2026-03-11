import { redirect } from 'next/navigation'

// README: "No home page. No listing. You only arrive here if someone sent you a link."
export default function Home() {
    redirect('/characters/new')
}
