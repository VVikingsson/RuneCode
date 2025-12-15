<template>
    <BContainer class="container">
        <div class="word-group">
            <img src="../assets/icons/R.svg" class="capital-letter"></img>
            <img src="../assets/icons/lowerN.svg" id="u" class="letter"></img>
            <img src="../assets/icons/N.svg" class="letter"></img>
            <img src="../assets/icons/E.svg" class="letter"></img>
        </div>
        <div class="word-group">
            <img src="../assets/icons/C.svg" class="capital-letter"></img>
            <img src="../assets/icons/lowerN.svg" class="letter"></img>
            <img src="../assets/icons/lowerN.svg" id="o" class="letter"></img>
            <img src="../assets/icons/I.svg" class="letter"></img>
            <img src="../assets/icons/C.svg" id="d" class="letter"></img>
            <img src="../assets/icons/E.svg" class="letter"></img>
        </div>
    </BContainer>
</template>

<style scoped>
    /* 2. Style for the new word groups */
    .word-group {
        /* Set the display of the group to be inline-flex so it acts as one unbreakable block */
        display: inline-flex;
        /* This ensures the items in the group stay together */
        align-items: flex-end; /* Align the bottom of the letters */
    }
    .container {
        width: 100% !important;
        /* Enable flex properties */
        display: flex; 
        /* Allow groups to wrap onto a new line when width runs out */
        flex-wrap: wrap; 
        /* Center the words when they wrap */
        justify-content: center;
        /* Add a small gap between the wrapped lines (Rune and Code) */
        gap: 0.5rem; 
    }
    .capital-letter {
        height: 5rem;
        margin-left: -1rem;
        filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%) drop-shadow(0px 0px 6px var(--neon-orange));
    }
    .letter {
        height: 4rem;
        margin-left: -1rem;
        filter: brightness(0) saturate(100%) invert(54%) sepia(77%) saturate(4835%) hue-rotate(211deg) brightness(101%) contrast(101%) drop-shadow(0px 0px 6px var(--primary-blue));
    }

    #o {
        margin-left: -4rem;
        transform: rotate(180deg);
    }

    #u {
        transform: rotate(180deg);
    }

    #d {
        margin-left: -3.1rem;
        transform: rotate(180deg);
    }
</style>