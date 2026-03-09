import { defineStore } from 'pinia'
import { axiosPost } from '@/utils/axiosWrapper'
import router from '../router'

interface AuthState {
  accessToken: string | null
  loggingIn: boolean
  loginError: string | null
  level: number
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    loggingIn: false,
    loginError: null,
    level: 0
  }),
  actions: {
    async doLogin(loginData: { email: string; password: string; rememberMeChecked: boolean }) {
      this.loggingIn = true
      try {
        const response = await axiosPost('/users/validate', {
          email: loginData.email.toLowerCase(),
          password: loginData.password
        })
        console.log(response.data.data)
        const level = response.data.data.level
        const isAdmin = level >= 1
        if (!response.data.hasError && isAdmin) {
          localStorage.setItem('accessToken', response.data.data._id)
          localStorage.setItem('level', level)
          this.loggingIn = false
          this.loginError = null
          this.accessToken = response.data.data._id
          this.level = level

          localStorage.setItem('email', loginData.email)
          if (loginData.rememberMeChecked) {
            localStorage.setItem('password', loginData.password)
          } else {
            localStorage.removeItem('password')
          }
          router.push('/dashboard')
        } else {
          if (response.data.hasError) {
            this.loginError = response.data.data
          } else {
            this.loginError = "You dont have admin privileges. Please request them at 'whyAmINotAdmin@kaiser.fyi'"
          }
          this.loggingIn = false
          this.accessToken = null
          this.level = 0
        }
      } catch (error: any) {
        console.error(error)
        this.loginError = error.response?.data?.error ?? 'Login failed'
        this.loggingIn = false
        this.accessToken = null
        this.level = 0
      }
    },
    fetchAccessToken() {
      this.accessToken = localStorage.getItem('accessToken')
      this.level = Number(localStorage.getItem('level') ?? 0)
    },
    logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('level')
      this.accessToken = null
      this.level = 0
      router.push('/Login')
    }
  }
})
