<template>
<BNavbar
  toggleable="lg"
  class="rune-navbar"
>
  <BNavbarBrand href="/">RuneCoder</BNavbarBrand>
  <BNavbarToggle target="nav-collapse" />
  <BCollapse id="nav-collapse" is-nav>
    <BNavbarNav class="mx-auto p-2" >
      <BNavItem href="/">Home</BNavItem>
      <BNavItem href="/challenges">Challenges</BNavItem>
      <BNavItem href="/leaderboard">Leaderboard</BNavItem>
      <BNavItem href="/users">Users</BNavItem>
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
    .rune-navbar {
        background-color: var(--section-bg);
        background-color: lightgrey;;
        display: block;
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