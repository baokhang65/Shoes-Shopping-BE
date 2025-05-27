<template>
  <v-app-bar flat>
    <v-btn href="#" text class="nav-text nav-title">
      <v-app-bar-title class="nav-text nav-title custom-title">
        <span class="color-j">J</span>
        <span class="color-9">9</span>
        <span class="color-7">7</span>
        <span class="color-store"> Store</span>
      </v-app-bar-title>
    </v-btn>

    <v-spacer></v-spacer>
    <v-spacer></v-spacer>

    <nav class="nav-menu">
      <a href="#" class="nav-item nav-text">ADIDAS</a>
      <a href="#" class="nav-item nav-text">NIKE</a>
      <a href="#" class="nav-item nav-text">VANS</a>
    </nav>

    <v-spacer></v-spacer>

    <v-text-field density="compact" variant="outlined" placeholder="Search products" append-inner-icon="mdi-magnify"
      single-line hide-details class="search-input" />

    <v-btn prepend-icon="mdi-account-circle-outline" text class="nav-text">
      Sign In / Login
    </v-btn>

    <v-btn icon="mdi-cart-outline" size="small" variant="text"></v-btn>
  </v-app-bar>
</template>

<script>
export default {};
</script>

<style scoped>
.search-input {
  max-width: 240px;
  --v-field-border-radius: 6px;
  margin-right: 12px;
}

.v-btn.text.nav-text {
  margin-left: 12px;
  margin-right: 12px;
}

.v-btn[icon="mdi-cart-outline"] {
  margin-left: 12px;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #111;
  text-transform: none;
}

.nav-title {
  font-size: 24px;
  font-weight: 700;
}

/* Custom màu từng chữ trong title */
.custom-title span {
  display: inline-block;
  /* giữ khoảng cách chữ nếu cần */
}

.color-j {
  color: #fd4c4c;
}

.color-9 {
  color: #7c83f2;
}

.color-7 {
  color: #62ffb9;
}

.color-store {
  color: #111;
  /* Màu đen như cũ */
}

/* Menu link underline effect */
.nav-item {
  position: relative;
  text-decoration: none;
  padding-bottom: 6px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #111;
  transition: width 0.3s ease;
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item:hover {
  color: #000;
}
</style>
