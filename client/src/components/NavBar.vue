<template>
<BNavbar
  toggleable="lg"
  class="rune-navbar"
>
  <BNavbarBrand href="/" id="brand" class="me-4 d-flex justify-content-center align-items-center">
    <img src="../assets/icons/R.svg" id="brand-R" class="brand-icon"/>
    <img src="../assets/icons/C.svg" id="brand-C" class="brand-icon"/>
  </BNavbarBrand>
  <BNavbarToggle target="nav-collapse"/>
  <BCollapse id="nav-collapse" is-nav>
    <BNavbarNav class="items-bar">
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
    <BNavbarNav class="right-nav ms-auto mb-lg-0">
      <BLink v-if="!user.loggedIn" :to="{ name: 'SignIn' }" class="text-decoration-none">
        <div
          aria-label="User Login Button"
          tabindex="0"
          role="button"
          class="log-in"
        >
          <div class="log-in-inner">
            Log In
          </div>
        </div>
      </BLink>
      <div v-else class="dropdown">
        <img
          src="https://characterai.io/i/200/static/avatars/uploaded/2024/4/4/Yac948S4fJgkL7I4CzcI8ieKaFAAdMcINqheICtLMZc.webp?webp=true&anim=0"
          alt="picture"
          class="avatar"
        />
        <div class="dropdown-content">
          <a href="#">View profile</a>
          <a href="#">Edit profile</a>
          <BDropdownItem class="sign-out-drpdwn" @click.prevent="logOut">Log out</BDropdownItem>
        </div>
      </div>
    </BNavbarNav>
  </BCollapse>
</BNavbar>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
const user = useUserStore()
const router = useRouter()
const logOut = async () => {
  user.logout()
  await router.push('/')
}
</script>
<style scoped>
.items-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.right-nav {
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown::after {
  content: "";
  position: absolute;
  top: 100%;
  right: 0;
  height: 12px; /* invisible safe distance */
  width: 100%;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 12px); /* visual gap */
  right: 0;
  align-items: center;
  padding: 10px;

  display: none;
  background-color: var(--navbar-bg);
  min-width: 200px;
  border-radius: 12px;
  border: 0.05rem solid var(--amber-primary);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content > *
{
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content > *:hover {
  background: #0056b3;
  align-items: center;
  border-radius: 8px;
  /*color: rgb(44, 186, 255) !important;*/
}

.dropdown:hover .dropdown-content {display: block;}

/* this is a button from universe.io*/
.log-in {
  width: 131px;
  height: 51px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s ease;
  background: linear-gradient(
    to bottom right,
    #2e8eff 0%,
    rgba(46, 142, 255, 0) 30%
  );
  background-color: rgba(46, 142, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-in:hover,
.log-in:focus {
  background-color: rgba(46, 142, 255, 0.7);
  box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
  outline: none;
}

.log-in-inner {
  width: 127px;
  height: 47px;
  border-radius: 13px;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
}

.icon {
  height: 2.6rem;
  /*margin-right: 0.2rem;
  margin-left: 2rem;
  margin-top: -1rem;*/
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
    /*display: block;*/
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
  /*margin-right: 0.2rem;
  margin-top: -0.5rem;*/
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
