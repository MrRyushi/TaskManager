<script setup>
    import TaskManager from './components/TaskManager.vue';
    import './assets/main.css'
</script>

<template>
    <div id="main-div">
        <div>
            <header>
                <h1 id="title">Task Manager</h1>
            </header>

            <main>
                <TaskManager/>
            </main>
        </div>
    </div>
</template>

<style scoped>
    #main-div {
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(245 245 245);
    }

    #title{
        text-align: center;
        font-size: 60px;
    }
</style>
