<template>
  <v-footer>
    <v-card flat tile class="py-12 px-5" width="100%" color="#F4F5F9">
      <v-row align="center" justify="space-between">
        <v-col cols="12" sm="6" md="4" class="d-flex flex-column">
          <div class="d-flex align-center">
            <div>
              <h2 class="mb-0 font-weight-bold" style="letter-spacing:0.3rem">J97&nbsp;Store</h2>
              <small class="orange--text font-italic">Vị tinh tú</small>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="d-flex justify-end">
          <v-btn icon="mdi-facebook"   variant="text" aria-label="Facebook" />
          <v-btn icon="mdi-instagram"  variant="text" aria-label="Instagram" />
          <v-btn icon="mdi-twitter"    variant="text" aria-label="Twitter" />
          <v-btn icon="mdi-linkedin"   variant="text" aria-label="LinkedIn" />
          <v-btn icon="mdi-youtube"    variant="text" aria-label="YouTube" />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <span>Copy&nbsp;right&nbsp;©&nbsp;J97&nbsp;Store</span>
          <v-btn variant="text" class="mx-2" small href="">Private&nbsp;Policies</v-btn>
          <v-btn variant="text" class="mx-2" small href="">Terms&nbsp;of&nbsp;Use</v-btn>
          <v-btn variant="text" class="mx-2" small href="">Cookie&nbsp;Policy</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
</style>
