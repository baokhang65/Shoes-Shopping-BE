<template>
  <v-footer app height="40">
    <a v-for="item in items" :key="item.title" class="d-inline-block mx-2 social-link" :href="item.href"
      rel="noopener noreferrer" target="_blank" :title="item.title">
      <v-icon :icon="item.icon" :size="item.icon === '$vuetify' ? 24 : 16" />
    </a>

    <div class="text-caption text-disabled" style="position: absolute; right: 16px;">
      &copy; 2016-{{ (new Date()).getFullYear() }} <span class="d-none d-sm-inline-block">Vuetify, LLC</span>
      —
      <a class="text-decoration-none on-surface" href="https://vuetifyjs.com/about/licensing/" rel="noopener noreferrer"
        target="_blank">
        MIT License
      </a>
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  {
    title: 'Vuetify Documentation',
    icon: `$vuetify`,
    href: 'https://vuetifyjs.com/',
  },
  {
    title: 'Vuetify Support',
    icon: 'mdi-shield-star-outline',
    href: 'https://support.vuetifyjs.com/',
  },
  {
    title: 'Vuetify X',
    icon: ['M2.04875 3.00002L9.77052 13.3248L1.99998 21.7192H3.74882L10.5519 14.3697L16.0486 21.7192H22L13.8437 10.8137L21.0765 3.00002H19.3277L13.0624 9.76874L8.0001 3.00002H2.04875ZM4.62054 4.28821H7.35461L19.4278 20.4308H16.6937L4.62054 4.28821Z'],
    href: 'https://x.com/vuetifyjs',
  },
  {
    title: 'Vuetify GitHub',
    icon: `mdi-github`,
    href: 'https://github.com/vuetifyjs/vuetify',
  },
  {
    title: 'Vuetify Discord',
    icon: ['M22,24L16.75,19L17.38,21H4.5A2.5,2.5 0 0,1 2,18.5V3.5A2.5,2.5 0 0,1 4.5,1H19.5A2.5,2.5 0 0,1 22,3.5V24M12,6.8C9.32,6.8 7.44,7.95 7.44,7.95C8.47,7.03 10.27,6.5 10.27,6.5L10.1,6.33C8.41,6.36 6.88,7.53 6.88,7.53C5.16,11.12 5.27,14.22 5.27,14.22C6.67,16.03 8.75,15.9 8.75,15.9L9.46,15C8.21,14.73 7.42,13.62 7.42,13.62C7.42,13.62 9.3,14.9 12,14.9C14.7,14.9 16.58,13.62 16.58,13.62C16.58,13.62 15.79,14.73 14.54,15L15.25,15.9C15.25,15.9 17.33,16.03 18.73,14.22C18.73,14.22 18.84,11.12 17.12,7.53C17.12,7.53 15.59,6.36 13.9,6.33L13.73,6.5C13.73,6.5 15.53,7.03 16.56,7.95C16.56,7.95 14.68,6.8 12,6.8M9.93,10.59C10.58,10.59 11.11,11.16 11.1,11.86C11.1,12.55 10.58,13.13 9.93,13.13C9.29,13.13 8.77,12.55 8.77,11.86C8.77,11.16 9.28,10.59 9.93,10.59M14.1,10.59C14.75,10.59 15.27,11.16 15.27,11.86C15.27,12.55 14.75,13.13 14.1,13.13C13.46,13.13 12.94,12.55 12.94,11.86C12.94,11.16 13.45,10.59 14.1,10.59Z'],
    href: 'https://community.vuetifyjs.com/',
  },
  {
    title: 'Vuetify Reddit',
    icon: `mdi-reddit`,
    href: 'https://reddit.com/r/vuetifyjs',
  },
]
</script>

<style scoped>
.footer {
  background: #424242;
  color: #fff;
  padding: 32px 0;
}

.footer__container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer__section-title {
  font-size: 1.125rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.footer__section-list {
  list-style: none;
  padding: 0;
}

.footer__section-item {
  margin-bottom: 8px;
}

.footer__section-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer__section-link:hover {
  opacity: 0.8;
}

.footer__social {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.footer__social-icon {
  color: #fff;
  transition: color 0.3s;
}

.footer__social-icon:hover {
  opacity: 0.8;
}

.footer__bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 960px) {
  .footer__container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer__container {
    grid-template-columns: 1fr;
  }
}
</style>
