<script>
import axios from 'axios';
export default {
    data() {
        return {
            tasklist: [],
            newTaskTitle: '',  
            newTaskStatus: ''  
        };
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await axios.get('http://localhost:3000/gettasks');
                this.tasklist = response.data; 
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        },


        async addTask() {
            if (this.newTaskTitle.trim() !== '') {
                try {
                    const response = await axios.post('http://localhost:3000/addtask', {
                        title: this.newTaskTitle,
                        status: this.newTaskStatus
                    });

                    
                    this.tasklist.push({
                        id: response.data.id, 
                        title: this.newTaskTitle,
                        status: this.newTaskStatus
                    });
                    
                    this.newTaskTitle = '';
                    this.newTaskStatus = '';
                } catch (error) {
                    console.log('Error adding task: ', error)
                }
            }
        },

        async updateTaskStatus(task, index) {
            const newStatus = 'Completed';  
            const updatedTask = {
                title: task.title, 
                status: newStatus 
            };

            try {
                const response = await axios.put(`http://localhost:3000/updatetask/${task.id}`, updatedTask);
                if (response.data.success) {
                    
                    this.tasklist[index] = {...task, ...updatedTask}; 
                } else {
                    console.error('Failed to update task:', response.data.message);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        },

        async deleteTask(task, index) {
            if (!task.id) {
                console.error('Task ID is missing, cannot delete');
                return;
            }

            try {
                const response = await axios.delete(`http://localhost:3000/deletetask/${task.id}`);
                if (response.data.success) {
                    this.tasklist.splice(index, 1);
                    console.log('Task deleted successfully');
                } else {
                    console.error('Failed to delete task:', response.data.message);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }

    },

    mounted(){
        this.fetchTasks();
    }
}
</script>

<template>
    <div>
        <h2 id="list-title">To do:</h2>
        <div id="task-list">
            <div v-if="tasklist.length === 0">
                No tasks yet
            </div>
            <div v-else class="tasks-container">
                <div class="task-item" v-for="(task, index) in tasklist" :key="index">
                        {{ index+1 }}. {{ task.title }} | {{ task.status }}
                    <div class="update-task">
                        <button id="complete-task" @click="updateTaskStatus(task, index)">Mark as Complete</button>
                        <button id="delete-task" @click="deleteTask(task, index)">Delete Task</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form id="task-form" @submit.prevent="addTask">
        <div class="input-form">
            <label for="task-title">Title:</label>
            <input v-model="newTaskTitle" id="task-title" type="text" placeholder="Title" required/>
            <label for="task-status">Status:</label>
            <select v-model="newTaskStatus" name="task-status" id="task-status" required>
                <option disabled selected>Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
            <button id="add-button" type="submit">Add Task</button>
        </div>
    </form>
    
</template>

<style>

    #list-title, #add-title {
        font-size: 40px;
        margin: 0;
    }

    .input-form {
        display: flex; 
        gap: 10px;     
        padding-left: 5%;
        align-items: center;
        justify-content: center;
    }

    #task-list{
        text-align: center;
        font-size: 24px;
    }


    #task-form{
        width: 40vw;
        margin-top: 20px;
        font-size: 24px;
    }

    #task-details{
        display: inline;
    }

    .task-item {
        display: flex;
        justify-content: space-between; 
        align-items: center;           
        border: 1px solid;
        padding: 6px;
        box-shadow: 2px 3px rgb(245 245 245);  
        margin-bottom: 10px;            
    }

    .update-task {
        display: flex;                 
        gap: 10px;                   
    }


    #complete-task {
        background-color: rgb(22 163 74);
        border:none;
        border-radius: 5px;
        margin-right: 4px;
        padding: 8px;
        color: white;
        font-size: 15px;
    }

    #complete-task:hover{
        background-color: rgb(21 128 61);
    }

    #delete-task {
        background-color: rgb(220 38 38); 
        border: none;
        border-radius: 5px;
        margin-right: 4px;
        padding: 8px;
        color: white;
        font-size: 15px;
    }

    #delete-task:hover {
        background-color: rgb(185 28 28);
    }
    
    #task-title, #task-status {
        padding: 5px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
    }

    #add-button {
        background-color:  rgb(217 119 6);
        border: none;
        padding: 10px 15px 10px 15px;
        border-radius: 5px;
        color: white;
        font-size: 15px;
    }

    #add-button:hover{
        background-color: rgb(180 83 9);
    }


</style>