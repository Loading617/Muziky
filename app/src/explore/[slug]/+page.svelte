<script lang="ts">
 import Carousel from "$lib/components/Carousel/Carousel.svelte";
 import { Grid } from "$lib/components/Grid";
 import Header from "$lib/components/Header.svelte";
 import CarouselItem from "$lib/components/Carousel/CarouselItem.svelte";
 import type { PageData } from "./$types";
 
 export let data: PageData;

 
 let sections = data?.sections;
 let path = data?.path;

</script>