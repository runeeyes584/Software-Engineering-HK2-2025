import { useState, useEffect } from 'react'

/**
 * Hook để debounce giá trị, hữu ích cho tìm kiếm, tránh gọi API quá nhiều lần
 * @param value Giá trị cần debounce
 * @param delay Thời gian trì hoãn (ms)
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Đặt một timeout để cập nhật giá trị debounced sau khi delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Hủy timeout nếu giá trị thay đổi (hoặc khi component unmount)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
