<script setup>
import {BCard, BCardImg, BCol, BContainer, BImg, BRow, BTab, BTabs} from "bootstrap-vue-next";
import {ref} from "vue";

//submissions table logic
const submissionsFields = [
  { key: 'submissionTitle', label: 'Your Solution' },
  { key: 'challengeName', label: 'Challenge' }
]
const userSubmissions = [
  { submissionTitle: 'two girls', challengeName: 'Challenge 12' },
  { submissionTitle: 'one mom', challengeName: 'Challenge 34' },
  { submissionTitle: 'i love AI', challengeName: 'Challenge 45' },
  { submissionTitle: '4 times in a row', challengeName: 'Challenge 45' },
  { submissionTitle: 'my grandpa taught me', challengeName: 'Challenge 56' }
]
</script>

<template>
  <div class="div1">
    <BContainer fluid class="main-con p-2 mt-3 d-flex flex-column gap-5">

      <BContainer
        class="profile-header flex-wrap d-flex align-items-stretch rounded-3 gap-3 p-0"
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
              <div>Challenges Mastered</div>
            </BCol>
            <BCol class="diff-col p-4 gap-4">
              <div>
                <div>Easy</div>
                <div>10</div>
              </div>
              <div>
                <div>Medium</div>
                <div>5</div>
              </div>
              <div>
                <div>Hard</div>
                <div>2</div>
              </div>
            </BCol>
          </BRow>
        </BCol>
      </BContainer>
<!-- submissions container -->
      <BContainer class="table-con p-4 rounded-4">
        <BTabs content-class="" class="my-tabs">
          <BTab
            title="Solutions"
            active
            class="first-tab"
          >
            <BTable
              v-if="userSubmissions.length > 0"
              hover
              :items="userSubmissions"
              :fields="submissionsFields"
              class="submissions-table text-start"
            >
            </BTable>
          </BTab>
        </BTabs>
      </BContainer>
    </BContainer>
  </div>

</template>

<style scoped>
.table-con {
  background-color: var(--card-bg);
  border: 1px solid var(--primary-blue);
}
.first-tab {
  background-color: var(--card-bg);
}

.my-tabs :deep(.nav-tabs) {
  background-color: transparent;
  border-bottom: none;
}
.submissions-table :deep(th) {
  background-color: transparent;
  color: white;
  border: none;
  padding: 15px;
}
.submissions-table {
  border-collapse: separate;
  border-spacing: 0 15px;
}
.submissions-table :deep(tbody tr td:first-child) {
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  border-right: none;
}

.submissions-table :deep(tbody tr td:last-child) {
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  border-left: none;
}
.submissions-table :deep(td){
  color: white;
  background-color: rgba(74, 120, 255, 0.5);
  padding: 15px;
  border: 1px solid var(--primary-blue);
}
.main-con {
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
