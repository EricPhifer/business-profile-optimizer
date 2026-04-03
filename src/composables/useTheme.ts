import { ref, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function toggle() {
    isDark.value = !isDark.value
    apply()
  }

  function apply() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('pws-theme', isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    const saved = localStorage.getItem('pws-theme')
    isDark.value = saved === 'dark'
    apply()
  })

  return { isDark, toggle }
}
