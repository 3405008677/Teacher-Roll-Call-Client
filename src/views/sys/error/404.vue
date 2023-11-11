<template>
  <main>
    <svg viewBox="0 -40 600 320">
      <symbol id="s-text">
        <text text-anchor="middle" x="50%" y="40%" class="text-line">404</text>
        <text text-anchor="middle" x="50%" y="60%" class="text-line2">Not Found</text>
      </symbol>
      <g class="g-ants">
        <use xlink:href="#s-text" class="text-copy"></use>
        <use xlink:href="#s-text" class="text-copy"></use>
        <use xlink:href="#s-text" class="text-copy"></use>
        <use xlink:href="#s-text" class="text-copy"></use>
        <use xlink:href="#s-text" class="text-copy"></use>
      </g>
    </svg>
  </main>
</template>
<script lang="ts" setup></script>
<style lang="scss">
  body {
    padding: 0;
    margin: 0;
  }
  main {
    position: fixed;
    background: #000000;
    font: 16em/0 arial;
    width: 100%;
    height: 100%;
  }

  .text-line {
    font-size: 0.5em;
  }

  .text-line2 {
    font-size: 0.2em;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .text-copy {
    fill: none;
    stroke: white;
    stroke-dasharray: 7% 28%;
    stroke-width: 3px;
    -webkit-animation: stroke-offset 8s infinite linear;
    animation: stroke-offset 8s infinite linear;
  }

  .text-copy:nth-child(1) {
    stroke: #30faac;
    stroke-dashoffset: 7%;
  }

  .text-copy:nth-child(2) {
    stroke: #80f776;
    stroke-dashoffset: 14%;
  }

  .text-copy:nth-child(3) {
    stroke: #ebdd5f;
    stroke-dashoffset: 21%;
  }
  .text-copy:nth-child(4) {
    stroke: #efeac5;
    stroke-dashoffset: 28%;
  }
  .text-copy:nth-child(5) {
    stroke: #4ec8db;
    stroke-dashoffset: 35%;
  }
  @-webkit-keyframes stroke-offset {
    50% {
      stroke-dashoffset: 35%;
      stroke-dasharray: 0 87.5%;
    }
  }
  @keyframes stroke-offset {
    50% {
      stroke-dashoffset: 35%;
      stroke-dasharray: 0 87.5%;
    }
  }
</style>
