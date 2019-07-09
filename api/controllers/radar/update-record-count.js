module.exports = {


  friendlyName: 'Update record count',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let recordTotal;
    try {
      recordTotal = await Record.find({ radar: req.body.id });
    } catch (err) {
      return void exits.success(500, { error: 'Validierungsfehler: Keine assoziierten Messungen' });
    }

    const total = recordTotal.length;

    let updated;
    try {
      updated = await Radar.updateOne({ id: req.body.id }).set({ recordCount: total }).fetch();
    } catch (err) {
      return exits.success(500, { error: 'Validierungsfehler: Messstation konnte nicht aktualisiert werden' })
    }
    return exits.success(updated);

  }


};
