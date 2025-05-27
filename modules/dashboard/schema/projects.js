const { Schema } = require("mongoose");
const { model } = require("mongoose");

const ProjectSchema = new Schema({
  project_name: { type: String, required: true },
  client: { name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    contact_person: { type: String, required: true },
   },
  assigned_to: { type: String, required: true },
  technology: { type: String, required: true },
  type: { type: String, required: true, enum: ["outSource", "contract", "employee", "internal",] },
  businessDeveloper: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, required: true, enum: ["active", "inactive", "completed", "cancelled"] },
  onboarding_date: { type: String, required: true },
  equipments_by: { type: String, required: true },
  project_manager: { type: String, required: true },
  project_description: { type: String, required: true },
  reporting_to: { type: String, required: true },
  shadow_developer: { type: String, required: true },
  end_date: { type: String },
  location: { type: String },
  remarks: { type: String },
});

module.exports = model("Project", ProjectSchema);