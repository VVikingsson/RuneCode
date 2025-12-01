<template>
<BNavbar
  toggleable="lg"
  class="rune-navbar"
>
  <BNavbarBrand href="/">RuneCoder</BNavbarBrand>
  <BNavbarToggle target="nav-collapse"/>
  <BCollapse id="nav-collapse" is-nav>
    <BNavbarNav class="mx-auto p-2">
      <BNavItem href="/"><img src="../assets/icons/bonfire.svg" id="home-icon"/>Home</BNavItem>
      <BNavItem href="/challenges"><img src = "../assets/icons/viking.svg" id="challenges-icon"/>Challenges</BNavItem>
      <BNavItem href="/leaderboard"><img src="../assets/icons/paper.svg" id="leaderboard-icon"/>Leaderboard</BNavItem>
      <BNavItem href="/users"><img src="../assets/icons/people.svg" id="users-icon"/>Users</BNavItem>
    </BNavbarNav>
    <!-- Right aligned nav items -->
    <BNavbarNav class="ms-auto mb-2 mb-lg-0">
      <BNavItemDropdown right>
        <!-- Using 'button-content' slot -->
        <template #button-content>
          <em>User</em>
        </template>
        <BDropdownItem>Profile</BDropdownItem>
        <BDropdownItem>Sign Out</BDropdownItem>
      </BNavItemDropdown>
    </BNavbarNav>
  </BCollapse>
</BNavbar>
</template>


<script setup>
</script>


<style scoped>
    #home-icon {
        height: 2rem;
        margin-right: 0.2rem;
        filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%) drop-shadow(0px 0px 14px var(--neon-orange));
    }
    #challenges-icon {
        height: 2rem;
        margin-right: 0.2rem;
        filter: brightness(0) saturate(100%) invert(77%) sepia(64%) saturate(6836%) hue-rotate(86deg) brightness(127%) contrast(117%) drop-shadow(0px 0px 14px var(--neon-green));
    }
    #leaderboard-icon {
        height: 2rem;
        margin-right: 0.2rem;
        filter: brightness(0) saturate(100%) invert(100%) sepia(28%) saturate(6845%) hue-rotate(106deg) brightness(105%) contrast(108%) drop-shadow(0px 0px 14px var(--neon-cyan));
    }

    #users-icon {
        height: 2rem;
        margin-right: 0.2rem;
        filter: brightness(0) saturate(100%) invert(18%) sepia(77%) saturate(4180%) hue-rotate(292deg) brightness(114%) contrast(127%) drop-shadow(0px 0px 14px var(--neon-magenta));
    }

    .rune-navbar {
        background-color: var(--section-bg);
        display: block;
        border-bottom: 1px solid var(--light-blue);
    }

    .rune-navbar > * {
        color: var(--primary-blue);
    }

    .defa {
        color: var(--primary-blue);
    }

    body {
        color: var(--primary-blue);
    }

</style>