
export function getConfig (key) {
  const config = window.CONFIG || {}
  return config[key] !== undefined
    ? config[key]
    : process.env[key]
}

/*
 * @vue/component
 * A mixin for components to access webpack / runtime config
 */
export default {
  methods: { getConfig }
}
