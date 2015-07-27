module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('pikaday').then(function() {
      return this.addBowerPackageToProject('moment');
    }.bind(this));
  }
};
