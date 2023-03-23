<div>
	<h2>Add New Board</h2>
	<form on:submit|preventDefault={()=>{}}>
		<fieldset>
			<legend>Name</legend>
		</fieldset>
		<fieldset>
			<legend>Columns</legend>
		</fieldset>
	</form>
</div>

<style lang="scss">
	div {
		background: white;
		padding: 32px;
		width: minMaxSize(343px, 480px);
	}
</style>
