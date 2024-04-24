import { useEffect, useState } from 'react'

export const useAppwrite = (fn) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const posts = await fn()
      setData(posts)
    } catch (e) {
      console.error('Error', e.message)
    }
    setLoading(false)
  }

  useEffect(() => {


    fetchData()
  }, [])

  const refetch = () => fetchData()

  return { data, loading, refetch }
}