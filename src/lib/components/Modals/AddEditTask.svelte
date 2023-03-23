<script>
    import { mainStore } from "$stores";
    //import {page} from "$app/stores"
</script>

<div>
	<h2>Add New Task</h2>
	<form on:submit|preventDefault={() => {}}>
		<fieldset>
			<legend>Title</legend>
			<input type="text" placeholder="e.g. Take coffee break" />
		</fieldset>
		<fieldset>
			<legend>Description</legend>
			<textarea rows="4" placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."/>
		</fieldset>
		<fieldset>
			<legend>Subtasks</legend>
			{#each [0, 1] as a}
				<div class="subtask" style="display: flex;">
					<input type="text" placeholder={["e.g. Make coffee","e.g. Drink coffee & smile"][a]}/>
					<button>
						<img alt="delete subtask" src="/images/icon-cross.svg" />
					</button>
				</div>
			{/each}
            <button class="add-subtask">+ Add New Subtask</button>
		</fieldset>
		<fieldset>
			<legend>Status</legend>
			<select>
				<option>Todo</option>
				<option>Done</option>
			</select>
		</fieldset>
		<input type="submit" value="Create Task" />
	</form>
</div>

<style lang="scss">
	.subtask {
		display: flex;
	}

    .add-subtask, input[type="submit"] {
        width: 100%;
        border-radius: 20px;
        border: none;
        height: 40px;
        font-weight: inherit;
        background: rgba(99, 95, 199, 0.1);
        color: var(--main-purple);
    }
    input[type="submit"]{
        background: var(--main-purple);
        color: white;
    }
</style>
