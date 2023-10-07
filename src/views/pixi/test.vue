<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as PIXI from 'pixi.js'
import Stats from 'stats.js'
import imgBunny from '@/assets/img/bunny.png'

const stats = new Stats()
document.body.append(stats.dom)
const con = ref()

onMounted(() => {
  const app = initPixi()
  const bunny = initSprite()
  animate()

  function initPixi() {
    const app = new PIXI.Application({
      background: '#1099bb',
      resizeTo: con.value,
    })
    con.value.appendChild(app.view)
    return app
  }
  function initSprite() {
    const bunny = PIXI.Sprite.from(imgBunny)
    app.stage.addChild(bunny)

    bunny.anchor.set(0.5)
    bunny.x = app.screen.width / 2
    bunny.y = app.screen.height / 2
    return bunny
  }

  function animate() {
    app.ticker.add((delta) => {
      stats.update()
      bunny.rotation += 0.1 * delta
    })
  }
})
</script>

<template>
  <div ref="con" class="w-full h-100vh overflow-hidden" />
</template>

<style lang='less' scoped>
.view-con{}
</style>
