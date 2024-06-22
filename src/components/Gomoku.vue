<script setup lang="ts">
import { reactive, ref } from 'vue';

type Color = 'black' | 'white';

const cols = 15;
const initialSquares = Array(cols).fill(null).map(() => Array(cols).fill(null).map(() => null));
const history = reactive<{ i: number, j: number }[]>([]);
const squares = reactive<(Color | null)[][]>(initialSquares);
const winner = ref<Color | null>(null);
const currentTurn = ref<Color>('white');

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

const changeTurn = () => {
    currentTurn.value = currentTurn.value === 'black' ? 'white' : 'black';
}

const selectSquare = (i: number, j: number, val: Color | null) => {
    if (winner.value) return;
    squares[i][j] = val;
    if (val === null) {
        changeTurn();
    }
    else {
        const winnerColor = isWinner(i, j);
        if (winnerColor) {
            winner.value = winnerColor;
        }
        else {
            history.push({ i, j });
            changeTurn();
        }
    }
}

const restart = () => {
    // clear all squares
    squares.forEach((row, i) => {
        row.forEach((_, j) => {
            squares[i][j] = null;
        })
    });
    // reset current turn to white
    currentTurn.value = 'white';
    // clear history
    history.forEach(() => {
        history.pop();
    })
    // no winner
    winner.value = null;
}
const undo = () => {
    if (history.length === 0) return;
    const { i, j } = history[history.length - 1];
    history.pop();
    selectSquare(i, j, null);
}
</script>   

<template>
    <div class="buttons">
        <button class="back" :disabled="history.length === 0" @click="undo">
            Back
        </button>
        <button class="new-game" title="New game" @click="restart">
            New game
        </button>
    </div>

    <p v-if="Boolean(winner)" class="winner-title" :class="[Boolean(winner) ? winner : '']">
        {{ winner }} won!
    </p>

    <p v-else class="current-turn">
        Turn: {{ currentTurn }}
    </p>

    <main class="container">
        <table :class="Boolean(winner) ? 'game-over' : ''">
            <tbody>
                <tr v-for="(row, i) in squares">
                    <td v-for="(square, j) in row">
                        <div v-if="Boolean(square)" class="circle" :style="{ backgroundColor: square || 'transparent' }">
                        </div>
                        <div @click="() => selectSquare(i, j, currentTurn)" v-else class="empty"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<style scoped lang="scss">
.buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 24px;

    button {
        padding: 8px 12px;
        transition: transform 0.2s ease;
        box-sizing: border-box;

        &:active {
            transform: scale(0.97);
        }

        &.new-game {
            margin-inline-start: 24px;
        }
    }
}

.current-turn {
    width: 100%;
    text-align: center;
}

.winner-title {
    font-size: 16px;
    text-align: center;
    color: black;

    &.white {
        color: white;
        text-shadow: 1px 1px 1px black;
    }
}

.container {
    max-width: 100vw;
    overflow: auto;
    background-color: rgba(165, 91, 1, 0.77);
    padding: 12px;

    table {
        position: relative;
        border: 1px solid black;
        border-collapse: collapse;
        table-layout: fixed;
        background-color: rgb(255 150 19 / 77%);

        &.game-over::after {
            content: "";
            position: absolute;
            inset: 0;
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
}
</style>