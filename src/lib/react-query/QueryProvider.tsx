import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export const QueryProvider = ({children} : {children:React.ReactNode}) => {
  //  i love u <3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333 
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

