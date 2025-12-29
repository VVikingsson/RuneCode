<template>
    <BContainer class="page-wrapper">
        <BRow class="search-bar-row">
            <BCol cols="4"></BCol>
            <BCol class="mt-4" cols="3">
            <BForm @submit.prevent="searchUsers">
                <BFormInput v-model="searchQuery" class="sign-in-field" placeholder="Search for user ..."></BFormInput>
            </BForm>
            </BCol>
            <BCol class="mt-4" cols="1">
                <BButton @click="searchUsers" class="search-button">
                    Search
                </BButton>
            </BCol>
            <BCol cols="4"></BCol>
        </BRow>
        <BRow>
            <BCol cols="1"></BCol>
            <BCol cols="10">
                <SearchResultContainer :users="searchResultUsers"/>
            </BCol>
            <BCol cols="1"></BCol>
        </BRow>
    </BContainer>        
</template>

<script setup>
import { ref } from 'vue';
import { Api } from '@/Api'
import SearchResultContainer from '../components/SearchResultContainer.vue';

const searchResultUsers = ref(null);
const searchQuery = ref('');

async function searchUsers() {
    try {
        if (!searchQuery.value) {
            return
        }
        const response = await Api.get(`users/search?searchQuery=${searchQuery.value}`);
        searchResultUsers.value = response.data.users;
    } catch (err) {
        console.log(err)
    }
}

</script>

<style scoped>
     @import '../assets/signIn.css';
    
     .sign-in-field::placeholder {
        color: var(--text-muted);
        font-family: 'Kedebideri', sans-serif;
        font-style: italic;
     }

     .sign-in-field:focus {
        box-shadow: unset;
        border-color: var(--text-light) !important;
     }

     .search-button {
        font-family: 'JetBrains Mono', monospace !important;
        background-color: unset !important;
        border: 2px solid var(--text-muted) !important;
        width: 130px;
        color: var(--text-muted) !important;
     }

     .search-button:hover {
        color: var(--text-light) !important;
        border-color: var(--text-light) !important;
     }

    .page-wrapper {
        height: 70vh !important;
    }
</style>