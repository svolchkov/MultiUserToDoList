		return Todos.find({
			$or: [
				{private:{$ne: true}},
				{owner: this.userId}
			]
		});