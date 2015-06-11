/*test*/
var types = {
	builder: require('CreepBuilder'),
	guard: require('CreepGuard'),
	harvester: require('CreepHarvester')
};
var PopulationCounter = require('PopulationCounter');
var Creator = require('Creator');
var Resources = require('Resources');

Memory.fullResourceTicker = 0;

console.log(
	'goals met:' + 
	PopulationCounter.goalsMet() + 
	', population: ' + 
	PopulationCounter.population + 
	' (' + PopulationCounter.getType('builder').total + '/' + PopulationCounter.getType('harvester').total + '/' + PopulationCounter.getType('guard').total + '), ' + 
	'resources at: ' + parseInt( (Resources.energy() / Resources.energyCapacity())*100) +'%'
);

for(var name in Game.creeps) {
	var creep = Game.creeps[name];
	var creepType = creep.memory.role;
	types[creepType](creep);
}

for(var name in Game.spawns) {
	var spawn = Game.spawns[name];
	if(spawn.spawning) {
		continue;
	}

	if((Resources.energy() / Resources.energyCapacity()) > 0.2) {
		var forceBuild = false;
		if(Memory.fullResourceTicker == 50) {
			forceBuild = true;
		}
		var types = PopulationCounter.getTypes()
		for(var i = 0; i < types.length; i++) {
			var type = PopulationCounter.getType(types[i]);
			
			if((i == types.length-1 && Resources.energy() == Resources.energyCapacity())) {
				Memory.fullResourceTicker++;
			} else {
				Memory.fullResourceTicker = 0;
			}
			
			if((type.goalPercentage > type.currentPercentage && type.total < type.max) || forceBuild) {
				Creator(types[i]); break;
			}
		}
	}
	
}