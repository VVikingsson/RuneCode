<template>
<BContainer>
    <BRow>
        <ChallengeBanner :number="submission.challengeNumber" :name="submission.challengeName" :id="submission.challengeId"/>
    </BRow>

    <BRow class="mt-4">
        <BCol>
            <BRow class="text-start">
                <h3 class="submission-title">
                    {{ submission.title }}
                </h3>
            </BRow>
            <BRow class="text-start">
                <p class="author-note">
                    {{ submission.authorNote }} Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus ipsum aut nostrum nulla, reiciendis suscipit nisi autem soluta magnam modi rerum quibusdam quod et quidem perferendis error ducimus ab veniam!
                </p>
            </BRow>
            <BRow class="text-center">
                <p class="authored-by">
                    Authored by: <RouterLink
                    :to="`/users/${submission.authorId}`"
                    class="author-link">
                        {{ submission.author }}
                    </RouterLink>
                </p>
            </BRow>
        </BCol>
        <BCol>
            <SubmissionCodeView :code="submission.code" :language="submission.language"/>
        </BCol>
    </BRow>
</BContainer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { Api } from '@/Api';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import ChallengeBanner from '../components/ChallengeBanner.vue'

const route = useRoute();

const submission = ref({
        code: {type: String, default: "Unknown code"},
        title: {type: String, default: "Unknown Title"},
        authorNote: {type: String, default: ""},
        author: {type: String, default: "Unknown author"},
        authorId: {type: String, default: ""},
        challengeNumber: {type: String, default: "xx."},
        challengeName: {type: String, default: "Unknown Challenge"},
        challengeId: {type: String, default: ""},
        language: {type: Object, default: python()}
    }
);

async function fetchSubmission() {
    try {
        const response = await Api.get(`/submissions/${route.params.id}`);
        return response.data
    } catch (err) {
        console.log('Something went wrong fetching submission data:', err);
    }
}

onMounted(async () => {
    const data = await fetchSubmission();
    console.log(data);
    submission.value = {
        code: data.code,
        title: data.title,
        authorNote: data.authorNote,
        author: data.author.username,
        authorId: data.author._id,
        challengeNumber: data.challenge.name.slice(0, 3),
        challengeName: data.challenge.name.slice(4, data.challenge.name.length),
        challengeId: data.challenge._id,
        language: data.language.toLowerCase() == 'python' ? python() : javascript()
    }
})
</script>


<style>
.author-link {
    color: var(--amber-primary);
}

.authored-by {
    color: var(--light-blue);
}

</style>