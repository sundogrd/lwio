<template>
  <div class="keke">
  </div>
</template>

<script>

function composeUri(uri, query = {}) {
  const arr = [];

  for (const f in query) {
    if (typeof query.hasOwnProperty !== 'function' || query.hasOwnProperty(f)) {
      arr.push(`${f}=${encodeURIComponent(query[f])}`)
    }
  }

  let s = arr.join('&')

  if (s && !/\?$/.test(uri)) {
    s = '?' + s
  }
  return `${uri}${s}`
}

export default {
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
    console.log(process.env)
    window.location.href = composeUri(process.env.OAUTH_LWIO.endpoint.authorize, {
      response_type: process.env.OAUTH_LWIO.oauthClientInfo.responseType,
      client_id: process.env.OAUTH_LWIO.oauthClientInfo.id,
      scope: process.env.OAUTH_LWIO.oauthClientInfo.scope,
      redirect_uri: process.env.OAUTH_LWIO.oauthClientInfo.redirectUri,
      state: 'fuck'
    })
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
