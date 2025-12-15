<script setup>

import {BCard, BCardImg, BCol, BContainer, BImg, BRow} from "bootstrap-vue-next";
</script>

<template>
  <div class="div1">
    <BContainer fluid class="bv-example-row p-0 mt-3">

      <BContainer
        class="flex-wrap d-flex align-items-stretch rounded-3 gap-3"
        fluid
      >
        <BCol class="profile-col p-3 rounded-4">
          <BRow class="row-image">
            <BCol class="column-img px-4 py-2 text-start">
              <BImg
                src="https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0"
                alt="Image"
                height="120"
                width="120"
                rounded="circle"
              />
            </BCol>
          </BRow>
          <BRow class="text-start">
            <p class="username">LebronJames</p>
            <p>Points 32500</p>
            <div>This is about me section. I love coding so much I would code my dna and dropship it to the doors of chinese communist party</div>
          </BRow>
        </BCol>

        <BCol class="challenge-stat-col p-3 rounded-4">
          <BRow class="h-100">
            <BCol class="chall-no-col d-flex flex-column justify-content-center">
              <div>17</div>
              <div>challenges solved</div>
            </BCol>
            <BCol class="diff-col p-4 gap-4">
              <div>
                <div>easy</div>
                <div>10</div>
              </div>
              <div>
                <div>medium</div>
                <div>5</div>
              </div>
              <div>
                <div>hard</div>
                <div>2</div>
              </div>
            </BCol>
          </BRow>
        </BCol>
      </BContainer>
    </BContainer>
  </div>

</template>

<style scoped>

.bv-example-row {
  width: 90%;
}
.profile-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
}

.challenge-stat-col {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
  flex: 2;
}
.chall-no-col {
  flex: 2
}
.diff-col {
  display: flex;
  flex-direction: column;
}
.diff-col > * {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  border-radius: 16px;
  background-color: var(--light-blue);
}

p {
  text-align: left;
}
p.username {
  font-size: 20px;
  text-align: left;
}

</style>
