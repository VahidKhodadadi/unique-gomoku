<script setup lang="ts">
import { reactive, ref } from 'vue';

type Color = 'BLACK' | 'WHITE';

const cols = 15;
const initialSquares = Array(cols).fill(null).map(() => Array(cols).fill(null).map(() => null));
const squares = reactive<(Color | null)[][]>(initialSquares);
const winner = ref<Color | null>(null);
const currentTurn = ref<Color>('WHITE');

const isWinner = (tempI: number, tempJ: number) => {
    let count = 0;
    // 4 directions to check
    // → 
    for (let j = tempJ - 4; j <= tempJ + 4; j++) {
        if (squares[tempI]
            && squares[tempI][j]
            && squares[tempI][j] === currentTurn.value) {
            count++;
            if (count === 5) {
                return currentTurn.value;
            }
        }
        else {
            count = 0;
        }
    }
    count = 0;
    // ↓ 
    for (let i = tempI - 4; i <= tempI + 4; i++) {
        if (squares[i]
            && squares[i][tempJ]
            && squares[i][tempJ] === currentTurn.value) {
            count++;
            if (count === 5) {
                return currentTurn.value;
            }
        }
        else {
            count = 0;
        }
    }
    count = 0;
    // ↘
    let index = -4;
    while (index <= 4) {
        if (squares[tempI + index]
            && squares[tempI + index][tempJ + index]
            && squares[tempI + index][tempJ + index] === currentTurn.value) {
            count++;
            if (count === 5) {
                return currentTurn.value;
            }
        }
        else {
            count = 0;
        }
        index++;
    }
    count = 0;
    // ↙ 
    let iIndex = -4;
    let jIndex = 4;
    while (iIndex <= 4 && jIndex >= -4) {
        if (squares[tempI + iIndex]
            && squares[tempI + iIndex][tempJ + jIndex]
            && squares[tempI + iIndex][tempJ + jIndex] === currentTurn.value) {
            count++;
            if (count === 5) {
                return currentTurn.value;
            }
        }
        else {
            count = 0;
        }
        iIndex++;
        jIndex--;
    }

    return null;
}

const selectSquare = (i: number, j: number) => {
    if (winner.value) return;
    squares[i][j] = currentTurn.value;
    const winnerColor = isWinner(i, j);
    if (winnerColor) {
        winner.value = winnerColor;
    }
    else {
        currentTurn.value = currentTurn.value === 'BLACK' ? 'WHITE' : 'BLACK';
    }
}

const restart = () => {
    squares.forEach((row, i) => {
        row.forEach((_, j) => {
            squares[i][j] = null;
        })
    });
    currentTurn.value = 'WHITE';
    winner.value = null;
}
</script>   

<template>
    <button title="New game" @click="restart">New game</button>
    <p v-if="Boolean(winner)" class="victory-title"
        :class="[Boolean(winner) ? winner === 'BLACK' ? 'black' : 'white' : '']">
        {{ winner }} won!
    </p>
    <p v-else>Turn: {{ currentTurn }}</p>

    <table :class="Boolean(winner) ? 'game-over' : ''">
        <tbody>
            <tr v-for="(row, i) in squares">
                <td v-for="(square, j) in row">
                    <div v-if="Boolean(square)" class="circle"
                        :class="[square === 'BLACK' ? 'black' : square === 'WHITE' ? 'white' : '']"></div>
                    <div @click="() => selectSquare(i, j)" v-else class="empty"></div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped lang="scss">
.victory-title {
    font-size: 16px;
    text-align: center;
    color: black;

    &.white {
        color: white;
        text-shadow: 1px 1px 1px black;
    }
}

table {
    position: relative;
    border: 1px solid black;
    border-collapse: collapse;
    table-layout: fixed;
    background-color: rgb(255 150 19 / 77%);

    &.game-over::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background-color: #cbcbcb8f;
    }

    td {
        border: 1px solid black;
        border-collapse: collapse;
        width: 30px;
        height: 30px;
        min-width: 30px;
        box-sizing: border-box;

        .circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-sizing: border-box;
            border: 4px solid #aaaaaa;

            &.white {
                background-color: white;
            }

            &.black {
                background-color: black;
            }
        }

        .empty {
            width: 100%;
            height: 100%;

            &:hover {
                cursor: pointer;
                background-color: #e3e3e3;
            }
        }
    }
}
</style>