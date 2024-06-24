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
    <div class="w-full flex items-center justify-start px-3">
        <button
            class="py-1 px-3 box-border border-2 border-gray-500 rounded-md bg-gray-100 hover:[&:not([disabled])]:bg-gray-200 active:[&:not([disabled])]:scale-95 transition-all"
            :disabled="history.length === 0" @click="undo">
            Back
        </button>
        <button
            class="ms-4 py-1 px-3 box-border border-2 border-gray-500 rounded-md bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
            title="New game" @click="restart">
            New game
        </button>
    </div>

    <p v-if="Boolean(winner)" class="text-base text-black text-center my-4">
        {{ winner }} won!
    </p>
    <p v-else class="w-full text-center my-4">
        Turn: {{ currentTurn }}
    </p>

    <main class="min-w-full overflow-auto bg-amber-800 p-4">

        <table class="relative border-black border-collapse table-fixed bg-amber-600"
            :class="Boolean(winner) ? 'after:content-none after:absolute after:inset-0 after:z-10 after:bg-gray-300' : ''">
            <tbody>
                <tr v-for="(row, i) in squares">
                    <td v-for="(square, j) in row" class="border-black border-2 border-collapse w-8 h-8 min-w-8 box-border">
                        <div v-if="Boolean(square)" class="w-full h-full rounded-full border-gray-400 border-2"
                            :style="{ backgroundColor: square || 'transparent' }">
                        </div>
                        <div @click="() => selectSquare(i, j, currentTurn)" v-else
                            class="w-full h-full hover:cursor-pointer hover:bg-gray-400"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
</template>