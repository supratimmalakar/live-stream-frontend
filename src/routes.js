import Home from "./pages/Home"
import Stream from "./pages/Stream"
import StreamView from "./pages/StreamView"

export const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/stream',
        component: Stream,
        exact: false
    },
    {
        path: '/view-stream/:id',
        component: StreamView,
    }
]