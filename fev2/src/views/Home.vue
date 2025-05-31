<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12">
            <v-carousel>
              <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" cover>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="d-flex fill-height justify-center align-center">
                      <h2 class="text-white top">{{ item.title }}</h2>
                      <br />
                    </div>
                    <div class="d-flex fill-height justify-center align-center">
                      <p class="text text-white">{{ item.text }}</p>
                    </div>
                    <div class="d-flex fill-height justify-center align-center">
                      <v-btn style="margin-top: -120px">Buy Now</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-carousel-item>
            </v-carousel>
          </v-col>
          <v-toolbar color="transparent">
            <v-toolbar-title>Popular Products</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon="mdi mdi-chevron-left"></v-btn>
            <v-btn icon="mdi mdi-chevron-right"></v-btn>
          </v-toolbar>
          <v-col cols="12" sm="12" class="mt-n10">
            <Suspense>
              <Popular />
              <template #fallback>
                <v-progress-circular indeterminate></v-progress-circular>
              </template>
            </Suspense>
          </v-col>
          <v-toolbar color="transparent" class="mt-n10">
            <v-toolbar-title>Featured Products</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn icon="mdi mdi-chevron-left"></v-btn>
            <v-btn icon="mdi mdi-chevron-right"></v-btn>
          </v-toolbar>
          <v-col cols="12" sm="12" class="mt-n10">
            <Suspense>
              <Featured />
              <template #fallback>
                <v-progress-circular indeterminate></v-progress-circular>
              </template>
            </Suspense>
          </v-col>
          <v-col cols="12" sm="12" class="mt-n10">
            <Suspense>
              <Client />
              <template #fallback>
                <v-progress-circular indeterminate></v-progress-circular>
              </template>
            </Suspense>
          </v-col>

          <v-col cols="12" sm="12" class="mt-n10">
            <v-row>
              <v-col cols="3" sm="4" v-for="(watch, index) in watches" :key="index">
                <v-card class="mx-auto my-12 pb-4" :max-width="374" :color="watch.color">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-card-item class="mt-10">
                        <v-card-title class="text-center">{{ watch.title }}</v-card-title>
                      </v-card-item>

                      <v-card-text>
                        <div class="text-center">
                          {{ watch.description }}
                        </div>
                        <div class="text-center mt-4">
                          <v-btn color="black">Buy Now</v-btn>
                        </div>
                      </v-card-text>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-img height="250" class="mx-4" :src="watch.image"
                        lazy-src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                        loading="lazy"></v-img>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <Footer />
    </v-main>
    <ScrollToTopButton />
  </v-app>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'

// Lazy load components
const Popular = defineAsyncComponent(() => import("@/components/Popular.vue"));
const Featured = defineAsyncComponent(() => import("@/components/Featured.vue"));
const Client = defineAsyncComponent(() => import("@/components/Client.vue"));

const watches = [
  {
    title: "Smart watch",
    description: "Small plates, salads & sandwiches",
    image: "image/13.jpg",
    color: null
  },
  {
    title: "Smart watch",
    description: "Small plates, salads & sandwiches",
    image: "image/14.jpg",
    color: "red"
  },
  {
    title: "Smart watch",
    description: "Small plates, salads & sandwiches",
    image: "image/15.jpg",
    color: null
  }
];
</script>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "7.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
        {
          src: "1.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
        {
          src: "2.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
        {
          src: "3.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
        {
          src: "4.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
        {
          src: "5.jpg",
          title: "Surface Studio",
          text: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès ",
        },
      ],
    };
  },
};
</script>
<style scoped>
.top {
  margin-top: 100px;
}

.text {
  margin-top: -40px;
  margin-left: 80px;
}

.top-day {
  margin-top: 120px;
}
</style>
