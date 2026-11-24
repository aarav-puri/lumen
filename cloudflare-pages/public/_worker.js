// Hands every request to the Lumen Worker, unchanged.
export default {
  fetch(request, env) {
    return env.LUMEN.fetch(request)
  },
}
