<template>
<BNavbar
  toggleable="lg"
  class="rune-navbar"
>
  <BNavbarBrand href="/" id="brand">
    <img src="../assets/icons/R.svg" id="brand-R" class="brand-icon"/>
    <img src="../assets/icons/C.svg" id="brand-C" class="brand-icon"/>
  </BNavbarBrand>
  <BNavbarToggle target="nav-collapse"/>
  <BCollapse id="nav-collapse" is-nav>
    <BNavbarNav class="mx-auto p-2">
      <BNavItem href="/">
        <img src="../assets/icons/bonfire.svg" class="icon" id="home-icon"/>
        Home
      </BNavItem>
      <BNavItem href="/challenges">
        <img src = "../assets/icons/viking.svg" class="icon" id="challenges-icon"/>
        Challenges
      </BNavItem>
      <BNavItem href="/leaderboard">
        <img src="../assets/icons/paper.svg" class="icon" id="leaderboard-icon"/>
        Leaderboard
      </BNavItem>
      <BNavItem href="/users">
        <img src="../assets/icons/people.svg" class="icon" id="users-icon"/>
        Users
      </BNavItem>
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
    .icon {
      height: 3rem;
      margin-right: 0.2rem;
      margin-left: 2rem;
      margin-top: -1rem;
    }
    #home-icon {
        filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%) drop-shadow(0px 0px 14px var(--neon-orange));
    }
    #challenges-icon {
        filter: brightness(0) saturate(100%) invert(77%) sepia(64%) saturate(6836%) hue-rotate(86deg) brightness(127%) contrast(117%) drop-shadow(0px 0px 14px var(--neon-green));
    }
    #leaderboard-icon {
        filter: brightness(0) saturate(100%) invert(100%) sepia(28%) saturate(6845%) hue-rotate(106deg) brightness(105%) contrast(108%) drop-shadow(0px 0px 14px var(--neon-cyan));
    }

    #users-icon {
        filter: brightness(0) saturate(100%) invert(18%) sepia(77%) saturate(4180%) hue-rotate(292deg) brightness(114%) contrast(127%) drop-shadow(0px 0px 14px var(--neon-magenta));
    }

    .rune-navbar{
        background-color: var(--navbar-bg);
        display: block;
    }

    .rune-navbar *{
      color: rgb(200, 200, 200) !important;
      font-family: 'Kedebideri', 'sans-serif';
    }

    #brand {
      color: var(--light-blue) !important;
    }

    .brand-icon {
      height: 3rem;
      margin-right: 0.2rem;
      margin-top: -0.5rem;
      filter: brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(2212%) hue-rotate(1deg) brightness(104%) contrast(102%) drop-shadow(0px 0px 14px var(--neon-orange));
    }
    #brand-R {
      height: 3rem;
    }
    #brand-C {
      margin-left: -2rem;
    }

    .brand-text {
      margin-left: -1rem;
    }
</style>