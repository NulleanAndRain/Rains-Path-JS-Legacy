let _loadLevel1 = () =>{
	return {
		"foregrounds": [                          //foregrounds
			{
				"tile": "air",
				"type": "air",
				"ranges": [
				//  [x, xRange, y, yRange]
					[0, 210, 16],
				]
			},

			{
				'tile': 'grass1',
				'type': 'solid',
				'sublevel': true,
				'ranges' : [
					[0, 20, 13],
					[22, 40, 13],
					[42, 25, 13],
					[70, 30, 13],
					[110, 100, 13],
					[12, 8, 9],
				]

			},

			{
				'tile': 'dirt6',
				'type': 'solid',
				'ranges' : [
					[0, 20, 14, 25],
					[22, 40, 14, 25],
					[42, 25, 14, 25],
					[70, 30, 14, 25],
					[110, 100, 14, 25],
				]

			},

			// {
			// 	'tile': 'dirt11',
			// 	'type': 'solid',
			// 	'ranges' : [
			// 		[0, 20, 15],
			// 		[22, 40, 15],
			// 		[42, 25, 15],
			// 		[70, 30, 15],
			// 		[110, 100, 15],
			// 	]

			// },
			// {
			// 	'tile': 'shadow',
			// 	'type': 'solid',
			// 	'ranges' : [
			// 		[0, 20, 16],
			// 		[22, 40, 16],
			// 		[42, 25, 16],
			// 		[70, 30, 16],
			// 		[110, 100, 16],
			// 	]

			// },
			{
				"tile": "stone6",
				"type": "solid",
				"ranges": [
					[5, 3, 9],
					[5, 7, 9],
					[12, 6, 11],
					[2, 1, 11],
					[10, 2, 10],
					[10, 2, 10],

					// [5, 3, 8],
					// [5, 2, 7],
					// [5, 6],
					// [5, 5, 2],
					// [4, 5],

					// [9, 1, 1, 5]
				]
			},
			{
				"tile": "cobble6",
				"type": "solid",
				"ranges": [
					[ 27, 5, 10],
					[40, 1, 1, 5],
					[50, 1, 10, 5],
					[64, 5, 5, 5],
					
					[0, 210, 50, 5],
				]
			},
			{
				"tile": "cobble13",
				"type": "solid",
				"ranges": [
					[ 27, 5, 9],
					[83, 3, 9],
					[86, 6, 5],
					[96, 3, 5],
					[99, 9],
					[105, 2, 9],
					[123, 5],
					[126, 3, 5],
					[132, 4, 5],
					[133, 2, 9],
					[171, 4, 9]
				]
			},
			{
				"tile": "cobble14",
				"type": "solid",
				"ranges": [
					[28, 9],
					[30, 9],
					[84, 9],
					[99, 5],

					[114, 5],
					[111, 9],
					[114, 9],
					[117, 9],

					[133, 2, 5],

					[173, 9],
					[141, 1, 9],
					[140, 2, 10],
					[139, 3, 11],
					[138, 4, 12],

					[144, 1, 9],
					[144, 2, 10],
					[144, 3, 11],
					[144, 4, 12],

					[155, 2, 9],
					[154, 3, 10],
					[153, 4, 11],
					[152, 5, 12],

					[159, 1, 9],
					[159, 2, 10],
					[159, 3, 11],
					[159, 4, 12],

					[191, 2, 5],
					[190, 3, 6],
					[189, 4, 7],
					[188, 5, 8],
					[187, 6, 9],
					[186, 7, 10],
					[185, 8, 11],
					[184, 9, 12]
				]
			},
			{
				"tile": "grass11",
				"type": "solid",
				"ranges": [
					[18, 2, 10],
				]
			},
			{
				"tile": "grass2",
				"type": "solid",
				"ranges": [
					[20, 9],
				]
			},
			{
				"tile": "grass3",
				"type": "solid",
				"ranges": [
					[17, 10],
				]
			},
			{
				"tile": "grass12",
				"type": "solid",
				"ranges": [
					[20, 10],
				]
			},
			{
				"tile": "grass14",
				"type": "solid",
				"ranges": [
					[15, 10],
				]
			},
			{
				"tile": "dirtToStone1",
				"type": "solid",
				"ranges": [
					[13, 5, 10],
				]
			},
			{
				"tile": "dirtToStone8",
				"type": "solid",
				"ranges": [
					[12, 10],
				]
			},
			{
				"tile": "dirtToStone13",
				"type": "solid",
				"ranges": [
					[12, 9],
				]
			},

			{
				"tile": "stone6",
				"type": "solid",
				"ranges": [
					[50, 3, 0],
				]
			},
			{
				"tile": "stone11",
				"type": "solid",
				"ranges": [
					[50, 3, 1],
				]
			},
			{
				"tile": "shadow",
				"type": "solid",
				"ranges": [
					[50, 3, 2],
				]
			},

			{
				"pattern": "grassCube",
				"ranges": [
					[10, 2],
				]
			},

			{
				'pattern': 'campfire',
				'ranges': [
					[15, 7],
				]
			}
		],

		'backgrounds':[                            //backgrounds
			{
				'tile': 'stone6',
				'ranges': [
					[15, 5, 0],
					[17, 1, 0, 5],

					[21, 4, 0],
					[21, 1, 0, 5],
					[21, 3, 2],
					[21, 4, 4],

					[26, 4, 0],
					[26, 4, 2],
					[26, 4, 4],
					[29, 1, 2, 3],
					[26, 1, 0, 3],

					[31, 5, 0],
					[33, 1, 0, 5],


					[0, 1, 0, 51],

					[150, 1, 0, 51],
				]
			},
		],

		'bg': [                                      //bg
			{
				'tile': 'stone6',
				'ranges': [
					[ 4, 3, 1, 1],
					[ 5, 1, 1, 3],

					[16, 3, 3, 1],
					[17, 1, 1, 3],

					[28, 3, 1, 1],
					[29, 1, 1, 3],
					
					[40, 3, 3, 1],
					[41, 1, 1, 3],
				]
			},
		],


		'patterns': {                                  //patterns
			'pattern1': {
				'tiles': [
				{
					'pattern': 'stoneSlab3',
					'type': 'solid',
					'ranges': [
						[0, 0],
						[0, 2],
						[0, 4],
					]
				}
				]
			},

			'grassCube' : {
				'tiles' : [
				{
					"tile": "grass0",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[0, 0],
					]
				},
				{
					"tile": "grass1",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[1, 0],
					]
				},
				{
					"tile": "grass2",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[2, 0],
					]
				},
				{
					"tile": "grass5",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[0, 1],
					]
				},
				{
					"tile": "grass6",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[1, 1, 1, 2],
					]
				},
				{
					"tile": "grass7",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[2, 1],
					]
				},
				{
					"tile": "grassCorner4",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[0, 2],
					]
				},
				{
					"tile": "grassCorner5",
					"type": "solid",
					'sublevel': true,
					"ranges": [
						[2, 2],
					]
				},
				{
					"tile": "dirt14",
					"type": "decoration",
					'sublevel': true,
					"ranges": [
						[1, 3],
					]
				},
				{
					"tile": "dirt13",
					"type": "decoration",
					'sublevel': true,
					"ranges": [
						[2, 3],
					]
				},
				]
			},

			'stoneSlab3' : {
				'tiles': [
				{
					'tile': 'stone6',
					'type': 'solid',
					'ranges': [
						[0, 3, 0],
					]
				}
				]
			},

			'campfire' : {
				'tiles': [
				{
					'animation': '_campfireLeft',
					'type': 'decoration',
					'ranges': [
						[0, 0],
					]
				},
				{
					'animation': '_campfireRight',
					'type': 'decoration',
					'ranges': [
						[1, 0],
					]
				},
				{
					'tile': 'air',
					'type': 'decoration',
					'ranges': [
						[0, 1],
					]
				},
				{
					'tile': 'air',
					'type': 'decoration',
					'ranges': [
						[1, 1],
					]
				}
				]
			},
		},

		'animations': {                                //animations
			'_campfireLeft': {
				'frames':[
					'campfire0',
					'campfire2',
					'campfire4',
					'campfire6',
					'campfire8',
					'campfire10',
					'campfire12',
					'campfire14',
				]
			},
			'_campfireRight': {
				'frames':[
					'campfire1',
					'campfire3',
					'campfire5',
					'campfire7',
					'campfire9',
					'campfire11',
					'campfire13',
					'campfire15',
				]
			},
		}
	};
}