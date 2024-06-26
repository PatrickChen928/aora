import { Alert } from 'react-native'
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
      Alert.alert('Error', e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = (...data) => fetchData(...data)

  return { data, loading, refetch }
}