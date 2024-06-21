<script setup lang="ts">
import { reactive, ref } from 'vue';

type Color = 'BLACK' | 'WHITE';

const squares = reactive<{color: Color | null}[][]>(Array(15).fill(Array(15).fill({ color: null })));
console.log('squares', squares);

const color = ref<Color>('WHITE');


const selectSquare = (i: number , j: number) => {
    console.log(i, j);
    
}

</script>   

<template>
    <table>
        <tbody>
            <tr v-for="(row, i) in squares" class="row">
                <td v-for="(square, j) in row">
                    <span v-if="!!square.color" class="circle" style="{ background-color: square.color; }"></span>
                    <span @click="() => selectSquare(i, j)" v-else></span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
table {
    border: 1px solid black;
    border-collapse: collapse;
    table-layout: fixed;    
}

td {
    border: 1px solid black;
    border-collapse: collapse;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
}
</style>