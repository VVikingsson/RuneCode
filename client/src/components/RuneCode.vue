<template>
    <BContainer class="container">
        <img src="../assets/icons/R.svg" class="capital-letter"></img>
        <img src="../assets/icons/lowerN.svg" id="u" class="letter"></img>
        <img src="../assets/icons/N.svg" class="letter"></img>
        <img src="../assets/icons/E.svg" class="letter"></img>
        <img src="../assets/icons/C.svg" class="capital-letter"></img>
        <img src="../assets/icons/lowerN.svg" class="letter"></img>
        <img src="../assets/icons/lowerN.svg" id="o" class="letter"></img>
        <img src="../assets/icons/I.svg" class="letter"></img>
        <img src="../assets/icons/C.svg" id="d" class="letter"></img>
        <img src="../assets/icons/E.svg" class="letter"></img>
    </BContainer>
</template>

<style scoped>
    .container {
        width: 100% !important;
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