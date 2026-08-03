import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readStorage, writeStorage } from '../utils/storage'

const USERS_KEY = 'usuarios'
const ACTIVE_USER_KEY = 'usuarioActivo'

const validUser = (user) =>
  user &&
  typeof user.nombre === 'string' &&
  typeof user.correo === 'string' &&
  typeof user.password === 'string'

export const useAuthStore = defineStore('auth', () => {
  const storedUsers = readStorage(USERS_KEY, [])
  const users = ref(Array.isArray(storedUsers) ? storedUsers.filter(validUser) : [])
  const storedActiveUser = readStorage(ACTIVE_USER_KEY, null)
  const activeUser = ref(validUser(storedActiveUser) ? storedActiveUser : null)

  const isAuthenticated = computed(() => Boolean(activeUser.value))
  const firstName = computed(() => activeUser.value?.nombre.split(' ')[0] || 'Invitado')

  function login(correo, password) {
    const user = users.value.find(
      (candidate) => candidate.correo === correo && candidate.password === password,
    )
    if (!user) return { ok: false, message: 'Correo o contraseña incorrectos.' }

    activeUser.value = user
    writeStorage(ACTIVE_USER_KEY, user)
    return { ok: true }
  }

  function register({ nombre, correo, password }) {
    if (users.value.some((user) => user.correo === correo)) {
      return { ok: false, message: 'Este correo ya está registrado.', type: 'warning' }
    }

    const user = { nombre, correo, password }
    users.value.push(user)
    writeStorage(USERS_KEY, users.value)
    return {
      ok: true,
      message: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
      type: 'success',
    }
  }

  function logout() {
    activeUser.value = null
    localStorage.removeItem(ACTIVE_USER_KEY)
  }

  return { users, activeUser, isAuthenticated, firstName, login, register, logout }
})
