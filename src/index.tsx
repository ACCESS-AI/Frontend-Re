import { ChakraProvider, ColorModeScript, useToast } from '@chakra-ui/react'
import '@fontsource/courier-prime/700.css'
import '@fontsource/courier-prime/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/400.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/400.css'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import Keycloak from 'keycloak-js'
import { compact, flattenDeep, join } from 'lodash'
import React from 'react'
import 'react-day-picker/dist/style.css'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Assignment from './pages/Assignment'
import Course from './pages/Course'
import CourseCreator from './pages/CourseCreator'
import Courses from './pages/Courses'
import Error from './pages/Error'
import { Landing } from './pages/Landing'
import Students from './pages/Students'
import Task from './pages/Task'
import theme from './Theme'
import Layout from './pages/Layout'
import Contact from './pages/Contact'

const authClient = new Keycloak({
  url: process.env.REACT_APP_AUTH_SERVER_URL || (window.location.origin + ':8443'),
  realm: 'access',
  clientId: 'access-client'
})

axios.defaults.baseURL = '/api/'
axios.interceptors.response.use(response => response.data)
const setAuthToken = (token?: string) => axios.defaults.headers.common = { 'Authorization': token && `Bearer ${token}` }

function App() {
  const toast = useToast()
  const onError = (error: any) => toast({ title: error?.response?.data?.message || 'Error', status: 'error' })
  const toURL = (...path: any[]) => join(compact(flattenDeep(path)), '/')
  const client = new QueryClient()
  client.setDefaultOptions({
    queries: { refetchOnWindowFocus: false, queryFn: context => axios.get(toURL(context.queryKey)) },
    mutations: { mutationFn: (data: any) => axios.post(toURL(data[0]), data[1]), onError }
  })

  const router = createBrowserRouter([{
    path: '/', errorElement: <Error />, children: [
      { index: true, element: <Landing /> },
      { path: 'contact', element: <Contact /> },
      { path: 'create', element: <CourseCreator /> },
      {
        path: 'courses', element: <Layout />, children: [
          { index: true, element: <Courses /> },
          {
            path: ':courseSlug', children: [
              { index: true, element: <Course /> },
              { path: 'students', element: <Students /> },
              {
                path: 'assignments', children: [
                  {
                    path: ':assignmentSlug', handle: 'Assignment', children: [
                      { index: true, element: <Assignment /> },
                      { path: 'tasks/:taskSlug', handle: 'Task', element: <Task /> }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }]
  }])

  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={authClient} onTokens={({ token }) => setAuthToken(token)}>
    <ChakraProvider theme={theme}>
      <ColorModeScript />
      {/* disabled because of https://github.com/suren-atoyan/monaco-react/issues/440
        <React.StrictMode>
          <App />
        </React.StrictMode> */}
      <App />
    </ChakraProvider>
  </ReactKeycloakProvider>)
